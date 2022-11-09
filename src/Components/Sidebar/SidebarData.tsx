import React from 'react';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as BsIcons from 'react-icons/bs';
import * as MdIcons from 'react-icons/md';

export const SidebarData = [
    {
      title: 'Home',
      path: '/',
      icon: <AiIcons.AiFillHome />,
    },
    {
      title: 'Audio',
      path: '#',
      icon: <AiIcons.AiFillAudio />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
  
      subNav: [
        {
          title: 'Word Detection',
          fullTitle: 'Audio > Word Detection',
          path: '/audio/word-detection',
          icon: <AiIcons.AiFillSetting />,
          cName: 'sub-nav'
        },
        {
          title: 'Mic Level',
          fullTitle: 'Audio > Mic Level',
          path: '/audio/mics-level',
          icon: <BsIcons.BsFillVolumeUpFill />,
          cName: 'sub-nav'
        },
        {
          title: 'Lorem Ipsum',
          fullTitle: 'Audio > Lorem Ipsum',
          path: '/audio/lorem-ipsum',
          icon: <IoIcons.IoIosPaper />
        }
      ]
    },
    {
      title: 'Video',
      path: '#',
      icon: <BsIcons.BsCameraVideoFill />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
  
      subNav: [
        {
          title: 'Scenes',
          fullTitle: 'Video > Scenes',
          path: '/video/scenes',
          icon: <AiIcons.AiFillSetting />,
          cName: 'sub-nav'
        },
        {
          title: 'Subtitles',
          fullTitle: 'Video > Subtitles',
          path: '/video/subtitles',
          icon: <AiIcons.AiFillSetting />,
          cName: 'sub-nav'
        },
        {
          title: 'Lorem Ipsum',
          fullTitle: 'Video > Lorem Ipsum',
          path: '/video/lorem-ipsum',
          icon: <IoIcons.IoIosPaper />
        }
      ]
    },
    {
      title: 'Actions',
      path: '#',
      icon: <RiIcons.RiArrowLeftRightLine />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
  
      subNav: [
        {
          title: 'Generate Action',
          fullTitle: 'Actions > Generate Event',
          path: '/action/general',
          icon: <AiIcons.AiFillSetting />,
          cName: 'sub-nav'
        },
        {
          title: 'Lorem Ipsum',
          fullTitle: 'Actions > Lorem Ipsum',
          path: '/action/lorem-ipsum',
          icon: <IoIcons.IoIosPaper />
        }
      ]
    }
  ];