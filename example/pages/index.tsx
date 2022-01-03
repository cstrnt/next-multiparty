import type { NextPage } from 'next'
import { FormEvent, useState } from 'react'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const [data, setData] = useState();
  const [file, setFile] = useState<File | null>();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if(!file) return;
    const form = new FormData()
    form.append("file", file)
    const fileInfo = await fetch("/api/hello", {
      method: "POST",
      body: form
    }).then(r => r.json())
    setData(fileInfo)
  }

  return (
    <div className={styles.container}>
      <h1>File Echo</h1>
      <form onSubmit={onSubmit}>
        <input type="file" onChange={e => setFile(e.target.files?.[0])} />
        <button type='submit'>Upload</button>
      </form>
      <h2>Result:</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

export default Home
