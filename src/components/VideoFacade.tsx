import { Play } from 'lucide-react'
import { useState } from 'react'
import type { Exercise } from '../data/types'
import styles from './VideoFacade.module.css'

// Nothing from YouTube's player loads until the tap; only the thumbnail image is fetched before.
export function VideoFacade({ exercise }: { exercise: Exercise }) {
  const [playing, setPlaying] = useState(false)
  const embedUrl = `https://www.youtube-nocookie.com/embed/${exercise.youtube_id}?autoplay=1&playsinline=1&rel=0`

  return (
    <div className={styles.wrapper}>
      <div className={styles.frame}>
        {playing ? (
          <iframe
            src={embedUrl}
            title={`Vidéo : ${exercise.name}`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          />
        ) : (
          <button type="button" className={styles.poster} onClick={() => setPlaying(true)}>
            <img
              src={`https://i.ytimg.com/vi/${exercise.youtube_id}/hqdefault.jpg`}
              alt=""
              width={480}
              height={360}
              loading="lazy"
            />
            <span className={styles.play}>
              <Play size={22} fill="currentColor" aria-hidden="true" />
              Voir la vidéo
            </span>
          </button>
        )}
      </div>
      <a className={styles.fallback} href={exercise.youtube_url} target="_blank" rel="noopener noreferrer">
        Ouvrir sur YouTube
      </a>
    </div>
  )
}
