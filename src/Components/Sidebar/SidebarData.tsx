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
          title: 'General',
          fullTitle: 'Audio > General',
          path: '/audio/general',
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
          title: 'General',
          fullTitle: 'Video > General',
          path: '/video/general',
          icon: <AiIcons.AiFillSetting />,
          cName: 'sub-nav'
        },
        {
          title: 'Video Level',
          fullTitle: 'Video > Video Level',
          path: '/video/mic-level',
          icon: <MdIcons.MdSwitchCamera />,
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
      title: 'Scenes',
      path: '#',
      icon: <MdIcons.MdOutlineCamera />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
  
      subNav: [
        {
          title: 'General',
          fullTitle: 'Scenes > General',
          path: '/scenes/general',
          icon: <AiIcons.AiFillSetting />,
          cName: 'sub-nav'
        },
        {
          title: 'Scenes Level',
          fullTitle: 'Scenes > Scenes Level',
          path: '/scenes/mic-level',
          icon: <IoIcons.IoMdPeople />,
          cName: 'sub-nav'
        },
        {
          title: 'Lorem Ipsum',
          fullTitle: 'Scenes > Lorem Ipsum',
          path: '/scenes/lorem-ipsum',
          icon: <IoIcons.IoIosPaper />
        }
      ]
    },
    {
      title: 'Events',
      path: '#',
      icon: <RiIcons.RiArrowLeftRightLine />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
  
      subNav: [
        {
          title: 'Generate Event',
          fullTitle: 'Events > Generate Event',
          path: '/events/general',
          icon: <AiIcons.AiFillSetting />,
          cName: 'sub-nav'
        },
        {
          title: 'Lorem Ipsum',
          fullTitle: 'Events > Lorem Ipsum',
          path: '/events/lorem-ipsum',
          icon: <IoIcons.IoIosPaper />
        }
      ]
    }
  ];