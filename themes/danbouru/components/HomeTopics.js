import HOME_TOPICS from '../homeTopics'

export default function HomeTopics() {
  const topics = HOME_TOPICS.filter(topic => topic.src && topic.href)
  if (topics.length === 0) return null

  return (
    <section className='danbouru-home-topics' aria-label='Topics'>
      <ul className='danbouru-home-topics-grid'>
        {topics.map(topic => (
          <li key={topic.id}>
            <a className='danbouru-home-topic-link' href={topic.href}>
              <img
                className='danbouru-home-topic-image'
                src={topic.src}
                alt={topic.alt}
                loading='lazy'
                decoding='async'
              />
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
