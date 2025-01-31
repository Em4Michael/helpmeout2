import { VideoPlayerProps } from '@/types/video-player'
import React, { useRef, useState, useEffect } from 'react'

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  videoID,
  setCurrentVideoTime,
  setCurrentVidDuration,
}) => {
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const recRef = useRef<HTMLVideoElement>(null)

  //to update the timer every second and set the duration
  useEffect(() => {
    const interval = setInterval(() => {
      if (recRef.current) {
        setDuration(recRef.current?.duration)
        setCurrentTime(recRef.current.currentTime)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // this toggles the play/pause state of the video
  const playPause = () => {
    const player = document.getElementById('videoPlayer')
    if ((player as HTMLVideoElement).paused) {
      recRef.current?.play()
    } else {
      recRef.current?.pause()
    }
  }

  const customTime = (seconds: number, duration: number) => {
    const timeLeft = duration - seconds
    const minutes = Math.floor(timeLeft / 60)
    const remainingSeconds = Math.floor(timeLeft % 60)
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`
  }

  //current time of the video
  //to get the current duration of video
  const [currentVidTime, setCurrentVidTime] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      if (recRef.current) {
        setCurrentVidTime(recRef.current.currentTime)
      }
    }, 1000) // Update every second

    return () => clearInterval(interval)
  }, [])

  // to set CurrentVideoTime
  const handleTimeUpdate = (event: any) => {
    // console.log("this handletimeupdate is called")
    setCurrentVideoTime(event.target.currentTime)
  }

  // to set current video duration - overall duration of the video
  useEffect(() => {
    const fetchVideo = async () => {
      // const videoUrl = `http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`;
      const videoUrl = `https://api.helpmeout.tech/video/${videoID}.mp4`
      const video = document.createElement('video')

      video.src = videoUrl
      video.preload = 'metadata' // Preload metadata to get duration

      video.addEventListener('loadeddata', function () {
        const duration = video.duration
        if (duration <= 1200) {
          setCurrentVidDuration(duration)
        }
        console.log(`The video duration is ${duration} seconds.`)
      })
    }

    fetchVideo()
  }, [videoID, setCurrentVidDuration])

  return (
    <div className="pt-2 px-2 pb-3 bg-[#FBFBFB80] relative  rounded-[24px] border border-gray-200 border-opacity-60 bg-opacity-50">
      <video
        id="videoPlayer"
        onClick={playPause}
        ref={recRef}
        autoPlay
        onTimeUpdate={handleTimeUpdate}
        className="w-full md:max-h-[500px] b rounded-[16px] border border-gray-200 border-opacity-60 bg-opacity-50 object-cover aspect-video"
      >
        <source src={url} type="video/mp4" />
      </video>
      <div className="bottom-5 right-4 bg-[#E7E7ED] font-[500] font-Work-Sans text-[14px] px-[14px] py-[7px] absolute rounded-[4px] ">
        {customTime(currentTime, duration)}
      </div>
    </div>
  )
}

export default VideoPlayer
