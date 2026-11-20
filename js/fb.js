// dun.not Firebase bağlantısı: Google ile giriş (Auth) ve yorumlar (Firestore).
import ayar from './firebase-ayar.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js';
export { collection, doc, query, where, getDoc, getDocs, addDoc, deleteDoc, writeBatch, serverTimestamp } from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js';

const app = initializeApp(ayar);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const dinle = f => onAuthStateChanged(auth, f);
export const cikis = () => signOut(auth);

// true: giriş yapıldı, false: kullanıcı vazgeçti; başka hata fırlatır.
export async function girisYap() {
  const p = new GoogleAuthProvider();
  p.setCustomParameters({ prompt: 'select_account' });
  try { await signInWithPopup(auth, p); return true; }
  catch (e) { if (/popup-closed|cancelled-popup/.test(e.code)) return false; throw e; }
}

export const kacis = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const tarih = z => z ? z.toDate().toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }) : 'şimdi';
