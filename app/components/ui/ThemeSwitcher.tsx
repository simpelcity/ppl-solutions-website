"use client"

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Dropdown } from 'react-bootstrap'
import { BsSunFill, BsFillMoonFill } from "react-icons/bs";
import { FaAngleDown } from "react-icons/fa6";
import { LuLaptopMinimal } from "react-icons/lu";
import type { Dictionary } from "@/app/i18n";
import "@/styles/layout/ThemeSwitcher.scss"

type Props = {
  width: number;
  dict: Dictionary;
}

export default function ThemeSwitcher({ width, dict }: Props) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);

  useEffect(() => {
    if (!theme) return;
    document.cookie = `ppl-theme=${resolvedTheme}; path=/; max-age=31536000; samesite=lax`
  }, [theme]);

  if (!resolvedTheme) return null;

  const icon = theme === 'system' ? <LuLaptopMinimal className="fs-5" /> : resolvedTheme === 'dark' ? <BsFillMoonFill /> : <BsSunFill />;
  const name = theme === 'system' ? dict.themeSwitcher.system : resolvedTheme === 'dark' ? dict.themeSwitcher.dark : dict.themeSwitcher.light;

  const show = width <= 1150;
  
  return (
    <Dropdown className="" align="end" id="theme-switcher" style={{ width: 'min-content' }} onToggle={(nextShow) => setIsThemeDropdownOpen(Boolean(nextShow))}>
      <Dropdown.Toggle variant="transparent" id="theme-dropdown" className="d-flex align-items-center px-0 py-1">
        {icon}
        {show && (
          <span className="fw-semibold ms-1">{dict.themeSwitcher.title}</span>
        )}
        <span className={`ms-1 chevron-rotate-180 ${isThemeDropdownOpen ? 'is-open' : ''}`}>
          <FaAngleDown />
        </span>
      </Dropdown.Toggle>
      <Dropdown.Menu className="mt-3 position-absolute rounded-1 border-0 shadow-sm py-0">
        <Dropdown.Item active={theme === 'light'} onClick={() => setTheme('light')} className="d-flex align-items-center fw-semibold">
          <BsSunFill className="me-2" />{dict.themeSwitcher.light}
        </Dropdown.Item>
        <Dropdown.Item active={theme === 'dark'} onClick={() => setTheme('dark')} className="d-flex align-items-center fw-semibold">
          <BsFillMoonFill className="me-2" />{dict.themeSwitcher.dark}
        </Dropdown.Item>
        <Dropdown.Item active={theme === 'system'} onClick={() => setTheme('system')} className="d-flex align-items-center fw-semibold">
          <LuLaptopMinimal className="me-2 fs-5" />{dict.themeSwitcher.system}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}
