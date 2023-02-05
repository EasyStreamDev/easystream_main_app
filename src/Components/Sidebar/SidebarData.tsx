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
      title: 'Actions & Reactions',
      path: '#',
      icon: <RiIcons.RiArrowLeftRightLine />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
  
      subNav: [
        {
          title: 'All Actions & Reactions',
          fullTitle: 'Actions & Reactions > Home',
          path: '/actions-reactions/home',
          icon: <IoIcons.IoIosPaper />
        },
        {
          title: 'Create Actions',
          fullTitle: 'Actions & Reactions > List of possible Actions',
          path: '/actions-reactions/actions',
          icon: <IoIcons.IoIosPaper />
        },
        {
          title: 'Create Reactions',
          fullTitle: 'Actions & Reactions > Create Reaction',
          path: '/actions-reactions/reactions',
          icon: <AiIcons.AiFillSetting />,
          cName: 'sub-nav'
        },
        {
          title: 'Word Detection',
          fullTitle: 'Actions & Reactions > Word Detection',
          path: '/actions-reactions/word-detection',
          icon: <AiIcons.AiFillSetting />,
          cName: 'sub-nav'
        },
        {
          title: 'Key Pressed',
          fullTitle: 'Actions & Reactions > Key Pressed',
          path: '/actions-reactions/key-pressed',
          icon: <AiIcons.AiFillSetting />,
          cName: 'sub-nav'
        }
      ]
    },
    {
      title: 'Other',
      path: '#',
      icon: <RiIcons.RiArrowLeftRightLine />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
  
      subNav: [
        {
          title: 'Feedback',
          fullTitle: 'Other > Feedback',
          path: '/other/feedback',
          icon: <IoIcons.IoIosPaper />
        },
      ]
    },
  ];