//import { useState, useEffect } from 'react'
import './App.css'
import { Routes, Route, Navigate } from 'react-dom';
import Login from '../src/components/login/login';
import { upsertCandidate } from './services/candidate-input';

function App() {

  async function handleSubmit (e) {
    e.preventDefault();
    if (e.target.email.value.trim() === '') {
      alert('Must insert valid email!');
    } else if (e.target.password.value.trim() === '') {
      alert('Must insert valid email!');
    } else {
      const { email, password } = {
        email: e.target.email.value,
        password: e.target.password.value
      };

      try {
        const userInput = await upsertCandidate({ email, password });
        e.target.reset();
      } catch (err) {
        console.log(err)
      }
    }
  }

  return (
    <>
    <Login />
    </>
  )
}

export default App
