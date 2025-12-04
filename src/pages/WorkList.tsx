import type {WorkCard} from '../types'
import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {sanity} from '../api/sanityClient'
import {Navigation} from '../components/Navigation'
import { WorkCards } from '../components/WorkCards'
import worksHeader from '../assets/worksHeader.png';
import '../styles/WorksList.css';


// Pull works where this person is involved (actor/director/crew)
const WORKS_FOR_PERSON = `
*[_type == "work"]
  | order(date desc){
    slug,
    picture{ _type, asset }
  }
`

export function WorkList() {
  const {slug} = useParams()
  const [works, setWorks] = useState<WorkCard[] | null>(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      const w = await sanity.fetch<WorkCard[]>(WORKS_FOR_PERSON)
      if (!active) return
      setWorks(w)
    })()
    return () => { active = false }
  }, [slug])
  

  return (
    <Navigation className='artist-list'>
      <div className='works'>
        <div className='works-title'>
          <img src={worksHeader} alt='works' />
        </div>
        <WorkCards items={works} />
      </div>
    </Navigation>
  );
}
