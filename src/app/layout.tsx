'use client';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import './globals.css';
import { Inter } from 'next/font/google';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/lib/locale/pt_BR';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: JSX.Element }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConfigProvider
          locale={ptBR}
          theme={{
            token: {
              colorPrimary: 'rgb(0, 21, 42)',
              colorLink: '#white',
              colorLinkHover: ' rgb(134, 142, 151)',
              borderRadius: 3,
              colorTextHeading: 'rgb(0, 21, 42)',
            },
          }}
        >
          <AuthProvider>{children}</AuthProvider>
        </ConfigProvider>
        ,
      </body>
    </html>
  );
}
