import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { query, collection, doc, getDoc, getDocs, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../Data/firebase';
import { Alert } from '@mui/material';
import Loading from '../Components/Loading';
import UserInfo from '../Components/UserInfo';
import Dashboard from '../Components/Dashboard';
import '../Design/Profile.css';

/**
 * Profile/homepage for users.
 * 
 * @param {*} param0 
 * @returns profile page
 */
export default function Profile( { mobileView } ) {

  const navigate = useNavigate();

  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [infoLoading, setInfoLoading] = useState(true);
  const [questionSets, setQuestionSets] = useState([]);
  const [questions, setQuestions] = useState(new Map());
  const [sharedSets, setSharedSets] = useState([]);

  /**
   * Fetch name of user by uid.
   * 
   * @returns user name
   */
  const fetchUserName = async () => {
    if (name !== '') return;
    try {
      const q = query(collection(db, 'users'), where('uid', '==', user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert('An error occured while fetching user data');
    }
  };

  /**
   * Fetch question sets owned by user.
   * 
   * @returns question sets
   */
  const fetchQuestionSets = async () => {
    try {
      const q = query(collection(db, 'question_sets'), where('owner_id', '==', user?.uid));
      const data = await getDocs(q);
      return data.docs.map((doc) => ({...doc.data(), id: doc.id }));
    } catch (err) {
      console.error(err);
      alert('An error occured while fetching question set data');
    }
  };

  /**
   * Fetch question sets shared with user.
   * 
   * @returns shared question sets
   */
  const fetchSharedQuestionSets = async () => {
    try {
      const q = query(collection(db, 'question_sets'), where('shared_users', 'array-contains', user?.uid));
      const data = await getDocs(q);
      return data.docs.map((doc) => ({...doc.data(), id: doc.id }));
    } catch (err) {
      console.error(err);
      alert('An error occured while fetching shared question sets data');
    }
  };

  /**
   * Fetch question by id.
   * 
   * @param {*} question_id 
   */
  const fetchQuestion = async (question_id) => {
    try {
      const ref = doc(db, 'questions', question_id);
      const qDoc = await getDoc(ref);
      const data = qDoc.data()
      questions.set(question_id, data);
      await setQuestions(questions);
    } catch (err) {
      console.error(err);
      alert('An error occured while fetching question');
    }
  };

  /**
   * Fetch all questions in question sets.
   * 
   * @param {*} q_sets 
   */
  const fetchAllQuestions = async (q_sets) => {
    for await (const qSet of q_sets) {
      for await (const qId of qSet.question_ids) {
        if (!questions.has(qId)) {
          await fetchQuestion(qId);
        }
      }
    }
  };

  /**
   * Fetch and set user information.
   */
  const fetchUserInfo = async () => {
    if (user?.photoURL) {
      setPhotoURL(user.photoURL);
    }
    await fetchUserName();
    const q_sets = await fetchQuestionSets();
    await fetchAllQuestions(q_sets);
    await setQuestionSets(q_sets);
    const s_sets = await fetchSharedQuestionSets();
    await fetchAllQuestions(s_sets);
    await setSharedSets(s_sets);
    setInfoLoading(false);
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate('/');
    setInfoLoading(true);
    fetchUserInfo();
  }, [user, loading]);

  if (mobileView) {
    return (
      <div className='mobile-view'>
        {error ? <Alert severity='error'>An error occurred!</Alert> : <></>}
        <div className='mobile-user-section'>
          {user && name ? <UserInfo user={user} name={name} photoURL={photoURL}/> : <></>}
        </div>
        {infoLoading || loading ? <Loading color={'#4eada5'}/> : 
          <Dashboard user={user} name={name} questionSets={questionSets} sharedSets={sharedSets} questions={questions}/>}
      </div>
    );
  } else {
    return (
        <div className='profile'>
          <aside className='sidemenu'>
            {user && name ? <UserInfo user={user} name={name} photoURL={photoURL}/> : <></>}
          </aside>
          <section className='question-set-section'>
            {error ? <Alert severity='error'>An error occurred!</Alert> : <></>}
            {infoLoading || loading ? <Loading color={'#4eada5'}/> : 
            <Dashboard user={user} name={name} questionSets={questionSets} sharedSets={sharedSets} questions={questions} photoURL={photoURL} />}
          </section>
        </div>
    );
  }
};