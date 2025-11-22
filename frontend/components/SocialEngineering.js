import { useState, useEffect } from 'react';

export default function SocialEngineering({ onUrgencyTrigger }) {
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours
  const [showUrgency, setShowUrgency] = useState(false);
  const [userCount, setUserCount] = useState(847);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) return 24 * 60 * 60; // Reset
        return prev - 1;
      });
    }, 1000);

    // Show urgency after 30 seconds
    const urgencyTimer = setTimeout(() => {
      setShowUrgency(true);
      onUrgencyTrigger?.();
    }, 30000);

    // Simulate increasing user count
    const userTimer = setInterval(() => {
      setUserCount(prev => prev + Math.floor(Math.random() * 3));
    }, 45000);

    return () => {
      clearInterval(timer);
      clearTimeout(urgencyTimer);
      clearInterval(userTimer);
    };
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Urgency Banner */}
      {showUrgency && (
        <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-red-600 to-orange-600 text-white p-3 z-50 animate-pulse">
          <div className="text-center">
            <div className="font-bold">⚠️ LIMITED TIME: Free Recovery Expires in {formatTime(timeLeft)}</div>
            <div className="text-sm">Don't miss your chance to recover lost crypto!</div>
          </div>
        </div>
      )}

      {/* Live User Counter */}
      <div className="fixed bottom-4 left-4 bg-green-600 text-white px-3 py-2 rounded-lg shadow-lg z-40">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold">{userCount.toLocaleString()} users online</span>
        </div>
      </div>

      {/* Success Stories Popup */}
      <SuccessStories />
    </>
  );
}

function SuccessStories() {
  const [currentStory, setCurrentStory] = useState(0);
  const [showStory, setShowStory] = useState(false);

  const stories = [
    {
      name: "Michael K.",
      amount: "$12,847",
      location: "New York",
      time: "2 minutes ago"
    },
    {
      name: "Sarah L.",
      amount: "$8,234",
      location: "California", 
      time: "5 minutes ago"
    },
    {
      name: "David R.",
      amount: "$15,692",
      location: "Texas",
      time: "8 minutes ago"
    },
    {
      name: "Emma W.",
      amount: "$6,543",
      location: "Florida",
      time: "12 minutes ago"
    }
  ];

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setShowStory(true);
    }, 60000); // Show after 1 minute

    const cycleTimer = setInterval(() => {
      if (showStory) {
        setCurrentStory(prev => (prev + 1) % stories.length);
      }
    }, 8000); // Change every 8 seconds

    return () => {
      clearTimeout(showTimer);
      clearInterval(cycleTimer);
    };
  }, [showStory]);

  if (!showStory) return null;

  const story = stories[currentStory];

  return (
    <div className="fixed bottom-20 right-4 bg-white border border-gray-200 rounded-lg shadow-xl p-4 max-w-sm z-40 animate-slide-in">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold">✓</span>
        </div>
        <div>
          <div className="font-semibold text-gray-900">{story.name} recovered {story.amount}</div>
          <div className="text-sm text-gray-600">{story.location} • {story.time}</div>
        </div>
      </div>
      <button 
        onClick={() => setShowStory(false)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        ×
      </button>
    </div>
  );
}