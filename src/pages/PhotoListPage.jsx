import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

const PAGE_LIMIT = 20;

function PhotoListPage() {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();

  const lastPhotoRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=${PAGE_LIMIT}`);
        const data = await res.json();
        setPhotos(prev => [...prev, ...data]);
        if (data.length < PAGE_LIMIT) setHasMore(false);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchPhotos();
  }, [page]);

  return (
    <div className="bg-blue-400 p-10 flex flex-col items-center">
      <h1 className="text-5xl font-bold font-serif mb-10 text-shadow-lg text-blue-950 ">Photo Gallery</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 center">
        {photos.map((photo, index) => {
          if (photos.length === index + 1) {
            return (
              <Link key={photo.id} to={`/photos/${photo.id}`} ref={lastPhotoRef}>
                <div className="bg-amber-50 rounded-2xl overflow-hidden hover:shadow-lg">
                  <img
                    src={`https://picsum.photos/id/${photo.id}/300/200`}
                    alt={photo.author}
                    className="w-full h-40 object-cover"
                  />
                  <div className="grid grid-cols-2">
                    <div className="basis-2/3 p-2 text-center font-semibold">{photo.author}</div>
                    <div className="basis-1/3 p-2 text-center font-semibold">{photo.id}</div>
                  </div>
                </div>
              </Link>
            );
          } else {
            return (
              <Link key={photo.id} to={`/photos/${photo.id}`}>
                <div className="bg-amber-50 rounded-xl overflow-hidden hover:shadow-lg">
                  <img
                    src={`https://picsum.photos/id/${photo.id}/300/200`}
                    alt={photo.author}
                    className="w-full h-40 object-cover"
                  />
                  <div className="flex flex-row">
                    <div className="basis-2/3 p-2 text-left font-semibold">{photo.author}</div>
                    <div className="basis-1/3 p-2 text-right font-semibold">{'#' + photo.id}</div>
                  </div>  
                </div>
              </Link>
            );
          }
        })}
      </div>
      {loading && <div className="text-center mt-4">Loading...</div>}
      {!hasMore && <div className="text-center mt-4">No more photos</div>}
    </div>
  );
}

export default PhotoListPage;
