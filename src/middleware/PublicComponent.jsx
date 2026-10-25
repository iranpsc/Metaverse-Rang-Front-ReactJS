import React, { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth.js'

export default function PublicComponent({ children }) {
  const { getUser } = useAuth();
  const [user, setUser] = useState();

  useEffect(() => {
    setUser(getUser());
  }, [getUser])


  return (
    <>
        {!user?.id ? children : <React.Fragment></React.Fragment> }
    </>
  )
}
