import React, {useEffect, useState} from 'react'
import Image from 'next/image'
import {openDB} from 'idb'

import {content, jiqiao} from '../public/data/data'
import {kanji} from '../public/data/kanjiDictionary'

type Content = {
  [key: string]: string[]
}

function getRandomImage(content: Content) {
  const keys = Object.keys(content)
  const randomKey = keys[Math.floor(Math.random() * keys.length)]
  const images = content[randomKey]
  const randomIndex = Math.floor(Math.random() * images.length)
  return images[randomIndex]
}

function getRandWord(arr: string[]) {
  const randomIndex = Math.floor(Math.random() * arr.length)
  return arr[randomIndex]
}

export default function Home() {
  const [image, setImage] = useState('')
  const [videoUrl, setVideoUrl] = useState('/videos/sample.mp4')
  const [showModal, setShowModal] = useState(false)
  const [modalImage, setModalImage] = useState('')
  const [word, setWord] = useState('')
  const [input, setInput] = useState('')
  const [dbContent, setDbContent] = useState([])

  function handleClick() {
    setImage(getRandomImage(content))
  }

  function handleVideoEnd() {
    setVideoUrl('/videos/sample.mp4')
  }

  function handleImageClick(imageUrl: string) {
    setModalImage(imageUrl)
    setShowModal(true)
  }

  function handleCloseModal() {
    setShowModal(false)
  }

  async function handleKeyPress(event: any) {
    if (event.key === 'Enter') {
      event.preventDefault()

      // 打开 IndexedDB 数据库
      const db = await openDB('my-database', 1)
      const tx = db.transaction('my-store', 'readwrite')
      const store = tx.objectStore('my-store')

      // 将输入内容保存到 IndexedDB
      if (input) {
        await store.add(input)

        // 清空输入框
        setInput('')

        // 更新 IndexedDB 内容
        const data: any = await store.getAll()
        setDbContent(data.reverse()) // 反转数据数组，最新记录显示在最上面
      }
    }
  }
  const handleClearClick = async () => {
    const db = await openDB('my-database', 1)
    const tx = db.transaction('my-store', 'readwrite')
    const store = tx.objectStore('my-store')

    await store.clear()
    setDbContent([])
  }

  useEffect(() => {
    setImage(getRandomImage(content))
    setWord(getRandWord(kanji))
    // 打开 IndexedDB 数据库
    const openDatabase = async () => {
      const db = await openDB('my-database', 1, {
        upgrade(db) {
          db.createObjectStore('my-store', {autoIncrement: true})
        },
      })
      const tx = db.transaction('my-store', 'readonly')
      const store = tx.objectStore('my-store')
      const data: any = await store.getAll()
      setDbContent(data.reverse()) // 反转数据数组，最新记录显示在最上面
    }

    openDatabase()
  }, [])

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between"
    >
      <div className="flex">
        <button onClick={handleClick} className="mt-4 px-4 py-2 mr-10 bg-blue-500 text-white rounded-md text-4xl">
            随机图片
        </button>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md text-4xl"
          onClick={() => {setWord(getRandWord(kanji))}}
        >
            随机汉字：{word || ''}
        </button>
      </div>
      <div className="my-2">
        <input
          className="w-[500px]"
          type="text"
          placeholder=""
          value={input}
          onChange={(e) => { setInput(e.target.value)}}
          onKeyDown={handleKeyPress}
          // onKeyPress={handleKeyPress}
        />
        <button
          className="bg-blue-400  mx-2 rounded-md p-2 text-white"
          onClick={() => {setInput('')}}>清空</button>
      </div>
      <div className="flex flex-wrap justify-center my-2">
        <div className="w-[480px] h-[360px]">
          {!!image && (<Image
            width={480}
            height={360}
            priority={true}
            src={image || ''}
            alt={image || ''} />)}
        </div>
      </div>
      <div className="flex">
        <div>
          {Object.keys(content).map((key) => (
            <div key={key} className="flex flex-col items-center justify-center">
              <div className="flex flex-col items-center justify-center">
                <div className="flex flex-wrap justify-center items-center">
                  <p className="text-[24px]">{key}</p>
                  {content[key].map((item: string) => (
                    <div key={item} className="w-40 h-40 m-2 cursor-pointer">
                      <Image
                        width={480}
                        height={360}
                        priority={true}
                        src={`${item}`}
                        alt={''}
                        onClick={() => handleImageClick(item)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4 text-4xl font-bold text-gray-600 dark:text-gray-100">
             五笔歌曲
            </div>
            <div className="flex flex-wrap justify-center">
              <div className="w-96 h-72 m-2">
                <video width={480} height={360} src={videoUrl} controls onEnded={handleVideoEnd} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col mb-10">
        {Object.keys(jiqiao).map((key) => (
          <div key={key} className="flex items-center">
            <div>
              <h1 className="text-2xl font-bold my-2 text-gray-600 dark:text-gray-100">{key}</h1>
              {jiqiao[key].map((item: string) => (
                <div key={item}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {showModal && modalImage && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="relative">
            <button onClick={handleCloseModal} className="absolute top-0 right-0 rounded-[50%] p-4 bg-red-400 text-white text-[24px]">关闭</button>
            <Image
              width={480}
              height={360}
              priority={true}
              src={`${modalImage}`}
              alt={modalImage} />
          </div>
        </div>
      )}
      <div className="fixed left-2 top-2 w-[280px] h-[500px] overflow-auto border-solid border-2 rounded-lg">
        <p className="text-center text-[32px]">历史记录</p>
        <p className="text-center text-[16px]">（输入的内容回车后进入记录中）</p>
        <button
          className="w-full bg-blue-300"
          onClick={handleClearClick}>清空记录</button>
        <div className="p-2">
          {dbContent.map((item, index) => (
            <div key={index}>{index + 1} {item}</div>
          ))}
        </div>
      </div>
    </main>
  )
}
