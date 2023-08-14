import React, {useEffect, useState} from 'react'
import Image from 'next/image'

import {content} from '../public/data/data'
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

  useEffect(() => {
    setImage(getRandomImage(content))
    setWord(getRandWord(kanji))
  }, [])

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between"
    >
      <div className="flex">
        <button onClick={handleClick} className="mt-4 px-4 py-2 mr-10 bg-blue-500 text-white rounded-md">
            随机记忆
        </button>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md "
          onClick={() => {setWord(getRandWord(kanji))}}
        >
            随机汉字：{word || ''}
        </button>
      </div>
      <div className="my-2">
        <input type="text" placeholder="" value={input} onChange={(e) => { setInput(e.target.value)}} />
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
        <div className="mb-32">
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
        <div className="mb-32">
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
    </main>
  )
}
