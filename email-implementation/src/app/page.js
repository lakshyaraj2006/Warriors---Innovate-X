'use client'

import axiosInstance from '@/lib/axios';
import { AxiosError } from 'axios';
import React, { useState } from 'react'
import { toast } from 'react-toastify'

export default function Home() {
  const [cred, setCred] = useState({email: ''});

  const handleChange = (e) => {
    setCred(cred => ({...cred, [e.target.name]: e.target.value}));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/login', cred, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const {success, message} = await response.json();

      if (success) {
        toast.success(message);
        setEmail('');
      } else {
        toast.error(message);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Some error occurred!');
      }
    }
  }
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <form onSubmit={handleSubmit} className='flex space-x-4'>
          <input type="email" name='email' id='email' placeholder="Enter your email" className="input input-primary w-96" onChange={handleChange} />
          <button className="btn btn-primary" type='submit'>Login</button>
      </form>
    </div>
  )
}
