import { Link } from 'react-router-dom'


const Blog = (props) => {

  return (
    <div>
      <Link to={`/blog/${props.blog.id}`}>
        <span>{props.blog.title}</span>
      </Link>
    </div>
  )
}


export default Blog
