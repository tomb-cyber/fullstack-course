import React from 'react'

const Course = ({course}) => {
    return(
      <>
        <Header header={course.name} />
        <Content parts={course.parts} />
      </>
    )
}  

const Header = (props) => (
    <>
        <h1>{props.header}</h1>
    </>)

const Content = ({parts}) => {
    return(
      <>
        <ul>
          {parts.map(part => 
            <Part key={part.id} name={part.name} exercises={part.exercises} />
            )}
        </ul>
        <Total parts={parts} />
      </>
  )}

const Part = (props) => (
<li>
    {props.name} {props.exercises}
</li>
)

const Total = ({parts}) => (
<p>
    Total number of exercises:{parts.reduce( 
    (sum, part) => (sum + part.exercises), 
    0 )}
</p>)

export default Course