import React from 'react';
import Image from 'next/image';
import axios from 'axios';

import { useQuery, QueryClient, QueryClientProvider } from 'react-query';
const sizes = `
    (min-width: 1020px) 1000px,
    calc(100vw - 20px)`;

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  );
}

function Example() {
  const myLoader = ({ src, width }) => {
    return `https://picsum.photos/id/${src}/${width}/${width}`;
  };

  const { status, data, error, isFetching } = useQuery(
    'photos',
    async ({ pageParam = 1 }) => {
      const res = await axios.get(
        `https://picsum.photos/v2/list?page=${pageParam}&limit=500`
      );

      return { photos: res.data };
    }
  );

  return (
    <div style={{ maxWidth: 1000, marginLeft: 'auto', marginRight: 'auto' }}>
      <h1>Simple Query with 500 Photos </h1>
      {status === 'loading' ? (
        <p>Loading...</p>
      ) : status === 'error' ? (
        <span>Error: {error.message}</span>
      ) : (
        <>
          {data.photos.map((photo) => (
            <div style={{ padding: 10 }} key={photo.id}>
              <Image
                src={photo.id}
                width={photo.width}
                height={photo.width}
                loader={myLoader}
                sizes={sizes}
                layout="responsive"
              />
            </div>
          ))}

          <div>{isFetching ? 'is Fetching...' : null}</div>
        </>
      )}
    </div>
  );
}
