"use client"
import styles from "./index.module.scss"

interface MyInputProps {
  value?: string | number,
  type?: string,
  placeholder?: string,
  onChange?: (e: any) => void,
  autocomplete?: string
}


export default function MyInput({ value, type, placeholder, onChange, autocomplete }: MyInputProps) {

  return (
    <div className={styles.wrap} >
      <input type={type} placeholder={placeholder} value={value} onChange={onChange} autoComplete={autocomplete} />
    </div>

  )
}

