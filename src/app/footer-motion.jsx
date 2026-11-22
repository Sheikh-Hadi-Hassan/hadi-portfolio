'use client';
import { useEffect } from 'react';
import { initializeFooter } from '../footer-runtime';

export default function FooterMotion() {
  useEffect(() => initializeFooter(), []);
  return null;
}
