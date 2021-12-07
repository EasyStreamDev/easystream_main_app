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
          path: '/audio/general',
          icon: <AiIcons.AiFillSetting />,
          cName: 'sub-nav'
        },
        {
          title: 'Mic Level',
          path: '/audio/mic-level',
          icon: <BsIcons.BsFillVolumeUpFill />,
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
      path: '#',
      icon: <BsIcons.BsCameraVideoFill />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
  
      subNav: [
        {
          title: 'General',
          path: '/audio/general',
          icon: <AiIcons.AiFillSetting />,
          cName: 'sub-nav'
        },
        {
          title: 'Video Level',
          path: '/audio/mic-level',
          icon: <MdIcons.MdSwitchCamera />,
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
      title: 'Scenes',
      path: '#',
      icon: <MdIcons.MdOutlineCamera />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
  
      subNav: [
        {
          title: 'General',
          path: '/audio/general',
          icon: <AiIcons.AiFillSetting />,
          cName: 'sub-nav'
        },
        {
          title: 'Scenes Level',
          path: '/audio/mic-level',
          icon: <IoIcons.IoMdPeople />,
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
      title: 'Events',
      path: '#',
      icon: <RiIcons.RiArrowLeftRightLine />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
  
      subNav: [
        {
          title: 'Generate Event',
          path: '/audio/general',
          icon: <AiIcons.AiFillSetting />,
          cName: 'sub-nav'
        },
        {
          title: 'Lorem Ipsum',
          path: '/audio/lorem-ipsum',
          icon: <IoIcons.IoIosPaper />
        }
      ]
    }
  ];