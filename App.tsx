
import React, { useState, useCallback } from 'react';
import ImageDropzone from './components/ImageDropzone';
import { revisualisePhotos } from './services/geminiService';
import { AppState } from './types';

const App: React.FC = () => {
  const [childImage, setChildImage] = useState<string | null>(null);
  const [adultImage, setAdultImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!childImage || !adultImage) return;

    try {
      setAppState(AppState.GENERATING);
      setErrorMessage(null);
      
      const generatedUrl = await revisualisePhotos(childImage, adultImage);
      
      setResultImage(generatedUrl);
      setAppState(AppState.SUCCESS);
    } catch (error: any) {
      console.error(error);
      setAppState(AppState.ERROR);
      setErrorMessage(error.message || "Something went wrong while reimagining your photos. Please try again.");
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setResultImage(null);
    setErrorMessage(null);
  };

  const isReady = !!childImage && !!adultImage;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-6 px-4 md:px-8 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-900">Revisualise</span>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 md:py-16">
        {appState === AppState.IDLE || appState === AppState.GENERATING || appState === AppState.ERROR ? (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Hug your <span className="gradient-text">younger self.</span>
              </h1>
              <p className="text-lg text-gray-600">
                Upload a photo of you as a child and one as an adult. 
                Our AI will bridge the gap of time and create a beautiful moment of interaction.
              </p>
            </div>

            {/* Upload Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <ImageDropzone 
                  label="The Child" 
                  description="Upload an old photo of you as a child (under 10 is best)"
                  image={childImage}
                  onImageSelect={(_, dataUrl) => setChildImage(dataUrl)}
                />
              </div>
              <div className="space-y-4">
                <ImageDropzone 
                  label="The Adult" 
                  description="Upload a recent photo of you as an adult"
                  image={adultImage}
                  onImageSelect={(_, dataUrl) => setAdultImage(dataUrl)}
                />
              </div>
            </div>

            {/* Error Message */}
            {appState === AppState.ERROR && (
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 text-rose-700 animate-in fade-in slide-in-from-top-2 duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium">{errorMessage}</p>
              </div>
            )}

            {/* Action Area */}
            <div className="flex flex-col items-center gap-4">
              <button
                disabled={!isReady || appState === AppState.GENERATING}
                onClick={handleGenerate}
                className={`
                  relative px-12 py-4 rounded-full font-bold text-lg shadow-xl transition-all duration-300
                  ${isReady && appState !== AppState.GENERATING 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-1 shadow-indigo-200' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}
                `}
              >
                {appState === AppState.GENERATING ? (
                  <div className="flex items-center gap-3">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Revising Time...
                  </div>
                ) : (
                  "Create the Moment"
                )}
              </button>
              {!isReady && (
                <p className="text-sm text-gray-400">Please upload both photos to continue</p>
              )}
            </div>

            {/* Loading placeholder if generating */}
            {appState === AppState.GENERATING && (
              <div className="mt-12 text-center animate-pulse">
                <div className="max-w-xl mx-auto h-[500px] bg-gray-100 rounded-[2.5rem] flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <p className="text-gray-400 font-medium">Blending the years together...</p>
                    <p className="text-xs text-gray-300">This usually takes about 20-30 seconds</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Success Result Area */
          <div className="space-y-10 animate-in fade-in zoom-in duration-700">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-gray-900">Your Journey Revisualised</h2>
              <p className="text-gray-600">A special moment that never happened, but now exists.</p>
            </div>

            <div className="max-w-xl mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-[2.6rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white rounded-[2.5rem] overflow-hidden shadow-2xl">
                <img 
                  src={resultImage || ''} 
                  alt="Revisualised generation" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = resultImage || '';
                  link.download = 'revisualise-moment.png';
                  link.click();
                }}
                className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 w-full md:w-auto"
              >
                Download Memory
              </button>
              <button 
                onClick={handleReset}
                className="px-8 py-3 bg-white text-gray-700 border border-gray-200 font-bold rounded-full hover:bg-gray-50 transition-colors w-full md:w-auto"
              >
                Create Another
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-100">
        <div className="max-w-6xl mx-auto text-center space-y-2">
          <p className="text-sm text-gray-400">Powered by Revisualise AI & Google Gemini</p>
          <p className="text-xs text-gray-300">© 2024 Revisualise. All moments are artificially generated.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
