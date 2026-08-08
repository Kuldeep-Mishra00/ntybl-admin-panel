import { useEffect, useState } from 'react';
import { fetchHome } from '../models/homeModel.js';

export function useSiteBranding() {
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    fetchHome()
      .then((data) => {
        if (data?.logo?.url) setLogoUrl(data.logo.url);
      })
      .catch(() => {});
  }, []);

  return { logoUrl };
}
