"use client"

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Dropdown } from 'react-bootstrap'
import { BsCircleHalf, BsMoonStarsFill, BsSunFill } from "react-icons/bs";
import { FaAngleDown } from "react-icons/fa6";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true)
  }, []);

  if (!mounted) return null;

  const activeTheme = theme === 'system' ? resolvedTheme : theme;
  const icon = activeTheme === 'dark' ? <BsMoonStarsFill /> : <BsSunFill />;

  return (
    <Dropdown align="end" className="" id="theme-switcher" style={{ width: 'min-content' }} onToggle={(nextShow) => setIsThemeDropdownOpen(Boolean(nextShow))}>
      <Dropdown.Toggle variant="transparent" id="theme-dropdown" className="d-flex align-items-center transparent-btn px-0 py-1">
        {icon}
        <span className={`ms-1 chevron-rotate-180 ${isThemeDropdownOpen ? 'is-open' : ''}`}>
          <FaAngleDown />
        </span>
      </Dropdown.Toggle>
      <Dropdown.Menu className="mt-3 position-absolute rounded-1 border-0 shadow-sm bg-surface-darker py-0">
        <Dropdown.Item active={theme === 'light'} onClick={() => setTheme('light')} className={`d-flex align-items-center fw-semibold text-theme ${activeTheme === 'light' ? 'text-light' : ''}`}>
          <BsSunFill className="me-2" />Light
        </Dropdown.Item>
        <Dropdown.Item active={theme === 'dark'} onClick={() => setTheme('dark')} className="d-flex align-items-center fw-semibold text-theme">
          <BsMoonStarsFill className="me-2" />Dark
        </Dropdown.Item>
        <Dropdown.Item active={theme === 'system'} onClick={() => setTheme('system')} className="d-flex align-items-center fw-semibold text-theme">
          <BsCircleHalf className="me-2" />System
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}
