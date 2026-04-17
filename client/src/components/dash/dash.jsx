import './dash.css'
import { useParams } from 'react-router-dom';



export default function Dashboard() {
  const { id } = useParams();

  return (
    <>
    <h1>candidate page</h1>
    <p>Candidate id: { id }</p>
    </>
  )
}