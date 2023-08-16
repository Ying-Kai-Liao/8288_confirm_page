import React, { useState, useRef, useEffect } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import successLottie from '../animations/success.json';
import failLottie from '../animations/fail.json';
import loadingLottie from '../animations/loading.json';

interface PaymentSuccessAnimationProps {
  success?: boolean;
  loading?: boolean;
}

const PaymentSuccessAnimation: React.FC<PaymentSuccessAnimationProps> = ({
  success = false,
  loading = true
}) => {
  const [animationFinished, setAnimationFinished] = useState(false);
  const [cardHeight, setCardHeight] = useState(0);
  const playerRef = useRef<any>(null);

  const handleEvent = async (event:any) => {
    if (event === 'complete') {
      await setAnimationFinished(true);
      playerRef.current?.setLoop(true);
      playerRef.current?.play();
    }
  };

  useEffect(() => {
    if (loading) {
      setAnimationFinished(true);
    } 
    setAnimationFinished(false);
  }, [loading])

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setLoop(false);
    }
  }, []);

  useEffect(() => {
    const element = document.getElementById('card');
    if (element) {
      const height = element.offsetHeight;
      console.log('Card Height:', height);
      setCardHeight(height);
    }
  }, []);

  const marginHeight = -0.5 * (cardHeight);

  const playerStyle = {
    transform: animationFinished ? 'scale(0.4)' : 'scale(4)',
    marginTop: animationFinished ? `${marginHeight}px` : '0rem', 
    transition: 'transform 2.0s ease 0.5s, margin-top 2.0s ease 0.5s',
    width: '100px',
    height: '100px',
  };

  return (
    <div
      className={`flex justify-center items-center
       transition-all duration-500 ${
        animationFinished ? 'absolute bg-transparent ' : success ? 'bg-green-200 absolute w-full h-full top-0 ' : loading ? 'bg-[#120123] fixed w-full h-full top-0' : 'bg-red-200 fixed w-full h-full top-0 '
      }`}
    >
      <div>
        {loading ? (
          <Player src={loadingLottie} autoplay loop />
        ):(
          <Player
          ref={playerRef}
          src={success ? successLottie : failLottie}
          loop={animationFinished}
          autoplay
          onEvent={handleEvent}
          style={playerStyle}
          className=''
        />
        )}
      </div>
    </div>
  );
}

export default PaymentSuccessAnimation;
