import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useContent(sectionId: string, defaultData: any) {
  const [data, setData] = useState<any>(defaultData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      try {
        const { data: fetchRes } = await supabase.from('portfolio_content').select('content').eq('id', sectionId).single();
        if (fetchRes?.content) {
          // Merge default data with fetched data so missing properties don't crash the UI
          setData((prev: any) => ({ ...defaultData, ...fetchRes.content }));
        }
      } catch (err) {
        console.error("Error fetching content:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, [sectionId]);

  return { data, loading };
}