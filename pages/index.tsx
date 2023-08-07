import React, {useEffect, useState} from 'react'
import Image from 'next/image'

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

const content: Content = {
  '横':[
    '/images/G.png',
    '/images/F.png',
    '/images/D.png',
    '/images/S.png',
    '/images/A.png',
  ],
  '竖':[
    '/images/H.png',
    '/images/J.png',
    '/images/K.png',
    '/images/L.png',
    '/images/M.png',
  ],
  '撇':[
    '/images/T.png',
    '/images/R.png',
    '/images/E.png',
    '/images/W.png',
    '/images/Q.png',
  ],
  '捺':[
    '/images/Y.png',
    '/images/U.png',
    '/images/I.png',
    '/images/O.png',
    '/images/P.png',
  ],
  '折':[
    '/images/X.png',
    '/images/C.png',
    '/images/V.png',
    '/images/B.png',
    '/images/N.png',
  ],
}
export default function Home() {

  const [image, setImage] = useState('')
  const [videoUrl, setVideoUrl] = useState('/videos/sample.mp4')
  const [showModal, setShowModal] = useState(false)
  const [modalImage, setModalImage] = useState('')

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
  }, [])

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between"
    >
      <button onClick={handleClick} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
          随机记忆
      </button>
      <div className="flex flex-wrap justify-center my-2">
        <div className="w-[480px] h-[360px]">
          {!!image && (<Image width={480} height={360} src={image || ''} alt={''} />)}
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
                    <div key={item} className="w-20 h-20 m-2 cursor-pointer">
                      <Image width={480} height={360} src={`${item}`} alt={''} onClick={() => handleImageClick(item)} />
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
            <Image width={480} height={360} src={`${modalImage}`} alt={''} />
          </div>
        </div>
      )}
    </main>
  )
}
