import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function PhotoDetailPage() {
  const { id } = useParams();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://picsum.photos/id/${id}/info`);
        const data = await res.json();
        setPhoto(data);
      } catch (err) {
        console.error(err);
        setPhoto(null);
      }
      setLoading(false);
    };

    fetchPhoto();
  }, [id]);

  if (loading) {
    return <p className="text-center text-white text-xl">Loading...</p>;
  }

  if (!photo) {
    return <p className="text-center text-red-400 text-xl">Photo not found.</p>;
  }

  return (
    <div className="p-4">
      <Link to="/photos" className="inline-block mb-4">
        <button className="bg-sky-500 hover:bg-sky-700 text-white px-3 py-1 rounded">
          ← Back to Gallery
        </button>
      </Link>

      <div className="max-w-full mx-auto text-center">
        <img
          src={photo.download_url}
          alt={photo.author}
          className="rounded mb-4 max-w-full mx-auto"
        />

        <h2 className="text-2xl font-bold mb-2">{photo.author}</h2>

        <p className="mb-1"><strong>ID:</strong> {photo.id}</p>
        <p className="mb-1"><strong>Original Size:</strong> {photo.width} × {photo.height}</p>
        <p className="mb-1"><strong>Description:</strong> The image belongs to author {photo.author}.</p>
      </div>
    </div>
  );
}

export default PhotoDetailPage;
