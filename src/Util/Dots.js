import React from 'react'

function Dot (props) {
  return (
    <span style={{
      display: 'inline-block',
      height: '8px',
      width: '8px',
      borderRadius: '4px',
      backgroundColor: 'black',
      margin: '7px 5px',
      opacity: props.selected ? '1' : '0.3',
      transitionDuration: '300ms'
    }} />
  )
}

export default function IndicatorDots (props) {
  const wrapperStyle = {
    width: '100%',
    zIndex: '100',
    bottom: '0px',
    textAlign: 'center'
  }

  if (props.total < 2) {
    // Hide dots when there is only one dot.
    return <div style={wrapperStyle} />
  } else {
    return (
      <div style={wrapperStyle}>
          {
              (props.index + 1) + "/" + props.total
          }
          <br/>
          {
        Array.apply(null, Array(props.total)).map((x, i) => {
          return <Dot key={i} selected={props.index === i} />
        })
      }</div>
    )
  }
}