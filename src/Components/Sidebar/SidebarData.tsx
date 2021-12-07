import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';

export const SidebarData = [
    {
      title: 'Home',
      path: '/',
      icon: <AiIcons.AiFillHome />,
    },
    {
      title: 'Audio',
      path: '/audio',
      icon: <IoIcons.IoIosPaper />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
  
      subNav: [
        {
          title: 'General',
          path: '/audio/general',
          icon: <IoIcons.IoIosPaper />,
          cName: 'sub-nav'
        },
        {
          title: 'Mic Level',
          path: '/audio/mic-level',
          icon: <IoIcons.IoIosPaper />,
          cName: 'sub-nav'
        },
        {
          title: 'Lorem Ipsum',
          path: '/audio/lorem-ipsum',
          icon: <IoIcons.IoIosPaper />
        }
      ]
    },
    {
      title: 'Video',
      path: '/video',
      icon: <FaIcons.FaCartPlus />
    },
    {
      title: 'Scenes',
      path: '/scenes',
      icon: <IoIcons.IoMdPeople />
    },
    {
      title: 'Events',
      path: '/events',
      icon: <FaIcons.FaEnvelopeOpenText />,
    }
  ];