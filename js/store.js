/**
 * Knot data store.
 *
 * A single async data-access layer that every other script uses instead of
 * touching localStorage directly. Two backends implement the exact same
 * API, so nothing else in the codebase needs to know or care which one is
 * active:
 *
 *   - LocalBackend:     the original behavior. Everything (accounts,
 *                       friends, invites, registered schools, club
 *                       memberships) lives only in this browser's
 *                       localStorage. Zero setup, but a friend who signs
 *                       up on their own device is invisible to you — there
 *                       is no shared directory of users to search.
 *   - FirestoreBackend: a shared Firebase Firestore database, so the same
 *                       account/friend/school/club data is visible from
 *                       any device, for real. This is what makes "search
 *                       for a real person and add them as a friend" work.
 *
 * To turn on the shared backend:
 *   1. Create a project at https://console.firebase.google.com
 *   2. Build > Firestore Database > Create database (test mode is fine —
 *      see the security note below).
 *   3. Project settings (gear icon) > General > "Your apps" > add a Web
 *      app > copy the firebaseConfig object into FIREBASE_CONFIG below.
 * Until FIREBASE_CONFIG is filled in, the site keeps working exactly as
 * before on the local-only backend.
 *
 * SECURITY NOTE: this site has no server, so Firestore security rules
 * can't verify "you are who you say you are" the way a real backend with
 * server-side auth would — anyone who can see this site's source (i.e.
 * everyone, since FIREBASE_CONFIG ships in the client bundle) can read
 * and write the database directly with the Firestore REST API or SDK.
 * Test-mode rules (open read/write) are fine for a personal demo among
 * friends, but do not store anything sensitive in it, and lock the rules
 * down (e.g. to signed-in Firebase Auth users) before treating this as
 * anything more than a toy.
 */

(function () {
  "use strict";

  const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCWLcisXHny6ZGbcocI2CIAKjkrIILuxg",
  authDomain: "knot--web-app.firebaseapp.com",
  projectId: "knot--web-app",
  storageBucket: "knot--web-app.firebasestorage.app",
  messagingSenderId: "543398083203",
  appId: "1:543398083203:web:9495a657286bfee9ba79b6"
};

  const FIREBASE_SDK_VERSION = "10.13.0";
  const isConfigured = Boolean(FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.projectId);

  // ============================================================
  // Local (localStorage) backend
  // ============================================================
  const LocalBackend = (() => {
    const USERS_KEY = "clubsphere_users";
    const SCHOOLS_KEY = "clubsphere_custom_schools";
    const MEMBERSHIPS_KEY = "clubsphere_memberships";
    const FRIENDS_KEY = "clubsphere_friends";
    const INVITES_KEY = "clubsphere_club_invites";

    function readJson(key, fallback) {
      try {
        const value = JSON.parse(localStorage.getItem(key));
        return value == null ? fallback : value;
      } catch {
        return fallback;
      }
    }

    function writeJson(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.warn(`Could not save ${key} locally — storage may be full.`, e);
      }
    }

    return {
      isRemote: false,

      async getAllUsers() {
        return readJson(USERS_KEY, {});
      },
      async saveUser(email, user) {
        const users = readJson(USERS_KEY, {});
        users[email] = user;
        writeJson(USERS_KEY, users);
      },

      async getCustomSchools() {
        return readJson(SCHOOLS_KEY, []);
      },
      async addCustomSchool(school) {
        const schools = readJson(SCHOOLS_KEY, []);
        schools.push(school);
        writeJson(SCHOOLS_KEY, schools);
      },
      async updateCustomSchool(school) {
        const schools = readJson(SCHOOLS_KEY, []);
        const idx = schools.findIndex((s) => s.id === school.id);
        if (idx !== -1) schools[idx] = school;
        writeJson(SCHOOLS_KEY, schools);
      },
      async deleteCustomSchool(id) {
        writeJson(SCHOOLS_KEY, readJson(SCHOOLS_KEY, []).filter((s) => s.id !== id));
      },

      async getMemberships() {
        return readJson(MEMBERSHIPS_KEY, {});
      },
      async saveMembership(key, membership) {
        const memberships = readJson(MEMBERSHIPS_KEY, {});
        memberships[key] = membership;
        writeJson(MEMBERSHIPS_KEY, memberships);
      },
      async deleteMembership(key) {
        const memberships = readJson(MEMBERSHIPS_KEY, {});
        delete memberships[key];
        writeJson(MEMBERSHIPS_KEY, memberships);
      },
      async deleteMembershipsForSchool(schoolId) {
        const memberships = readJson(MEMBERSHIPS_KEY, {});
        Object.keys(memberships).forEach((key) => {
          if (key.startsWith(`${schoolId}::`)) delete memberships[key];
        });
        writeJson(MEMBERSHIPS_KEY, memberships);
      },

      async getFriends(email) {
        return readJson(FRIENDS_KEY, {})[email] || [];
      },
      async addFriend(emailA, emailB) {
        const map = readJson(FRIENDS_KEY, {});
        map[emailA] = Array.from(new Set([...(map[emailA] || []), emailB]));
        map[emailB] = Array.from(new Set([...(map[emailB] || []), emailA]));
        writeJson(FRIENDS_KEY, map);
      },
      async removeFriend(emailA, emailB) {
        const map = readJson(FRIENDS_KEY, {});
        map[emailA] = (map[emailA] || []).filter((e) => e !== emailB);
        map[emailB] = (map[emailB] || []).filter((e) => e !== emailA);
        writeJson(FRIENDS_KEY, map);
      },

      async getInvitesFor(email) {
        return readJson(INVITES_KEY, []).filter((inv) => inv.toEmail === email || inv.fromEmail === email);
      },
      async addInvite(invite) {
        const invites = readJson(INVITES_KEY, []);
        invites.push(invite);
        writeJson(INVITES_KEY, invites);
      },
      async updateInviteStatus(id, status) {
        const invites = readJson(INVITES_KEY, []);
        const invite = invites.find((inv) => inv.id === id);
        if (invite) invite.status = status;
        writeJson(INVITES_KEY, invites);
      }
    };
  })();

  // ============================================================
  // Firestore backend
  // ============================================================
  let firestoreReadyPromise = null;

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });
  }

  function initFirestore() {
    if (!firestoreReadyPromise) {
      firestoreReadyPromise = (async () => {
        await loadScript(`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-app-compat.js`);
        await loadScript(`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-firestore-compat.js`);
        firebase.initializeApp(FIREBASE_CONFIG);
        return firebase.firestore();
      })();
    }
    return firestoreReadyPromise;
  }

  const FirestoreBackend = {
    isRemote: true,

    async getAllUsers() {
      const db = await initFirestore();
      const snap = await db.collection("users").get();
      const users = {};
      snap.forEach((doc) => {
        users[doc.id] = doc.data();
      });
      return users;
    },
    async saveUser(email, user) {
      const db = await initFirestore();
      await db.collection("users").doc(email).set(user, { merge: true });
    },

    async getCustomSchools() {
      const db = await initFirestore();
      const snap = await db.collection("customSchools").get();
      return snap.docs.map((doc) => doc.data());
    },
    async addCustomSchool(school) {
      const db = await initFirestore();
      await db.collection("customSchools").doc(school.id).set(school);
    },
    async updateCustomSchool(school) {
      const db = await initFirestore();
      await db.collection("customSchools").doc(school.id).set(school);
    },
    async deleteCustomSchool(id) {
      const db = await initFirestore();
      await db.collection("customSchools").doc(id).delete();
    },

    async getMemberships() {
      const db = await initFirestore();
      const snap = await db.collection("memberships").get();
      const memberships = {};
      snap.forEach((doc) => {
        memberships[doc.id] = doc.data();
      });
      return memberships;
    },
    async saveMembership(key, membership) {
      const db = await initFirestore();
      await db.collection("memberships").doc(key).set(membership);
    },
    async deleteMembership(key) {
      const db = await initFirestore();
      await db.collection("memberships").doc(key).delete();
    },
    async deleteMembershipsForSchool(schoolId) {
      const db = await initFirestore();
      const snap = await db.collection("memberships").get();
      const batch = db.batch();
      snap.forEach((doc) => {
        if (doc.id.startsWith(`${schoolId}::`)) batch.delete(doc.ref);
      });
      await batch.commit();
    },

    async getFriends(email) {
      const db = await initFirestore();
      const doc = await db.collection("friends").doc(email).get();
      return doc.exists ? doc.data().emails || [] : [];
    },
    async addFriend(emailA, emailB) {
      const db = await initFirestore();
      const FieldValue = firebase.firestore.FieldValue;
      await Promise.all([
        db.collection("friends").doc(emailA).set({ emails: FieldValue.arrayUnion(emailB) }, { merge: true }),
        db.collection("friends").doc(emailB).set({ emails: FieldValue.arrayUnion(emailA) }, { merge: true })
      ]);
    },
    async removeFriend(emailA, emailB) {
      const db = await initFirestore();
      const FieldValue = firebase.firestore.FieldValue;
      await Promise.all([
        db.collection("friends").doc(emailA).set({ emails: FieldValue.arrayRemove(emailB) }, { merge: true }),
        db.collection("friends").doc(emailB).set({ emails: FieldValue.arrayRemove(emailA) }, { merge: true })
      ]);
    },

    async getInvitesFor(email) {
      const db = await initFirestore();
      const [toSnap, fromSnap] = await Promise.all([
        db.collection("invites").where("toEmail", "==", email).get(),
        db.collection("invites").where("fromEmail", "==", email).get()
      ]);
      const seen = new Map();
      toSnap.forEach((doc) => seen.set(doc.id, { id: doc.id, ...doc.data() }));
      fromSnap.forEach((doc) => seen.set(doc.id, { id: doc.id, ...doc.data() }));
      return Array.from(seen.values());
    },
    async addInvite(invite) {
      const db = await initFirestore();
      await db.collection("invites").doc(invite.id).set(invite);
    },
    async updateInviteStatus(id, status) {
      const db = await initFirestore();
      await db.collection("invites").doc(id).update({ status });
    }
  };

  window.KnotStore = isConfigured ? FirestoreBackend : LocalBackend;
})();
