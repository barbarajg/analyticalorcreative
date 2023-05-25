import React from 'react'

export const Header = (props) => {
  return (
    <>
        <h1>{props.title}</h1>
        <h3>{props.subtitle}</h3>
    </>
  )
}
