import React from 'react'
import styles from "./index.module.scss"
import { AnimatePresence, motion } from 'framer-motion'


interface options {
  value: string,
  label: string
}
interface DropDownProps {
  options?: options[],
  sub?: string[],
  onChange: (e: string) => void,
  selected?: string,
  className?: string,
  boxed?: boolean,
  postfix?: string,
  prefix?: string,
  mixed?: boolean
}

export default function DropDown({ options, onChange, selected, className, boxed, postfix, prefix, mixed, sub }: DropDownProps) {

  const [open, setOpen] = React.useState(false)
  const [inner, setInner] = React.useState('')

  return (
    <div className={boxed ? styles.boxed : styles.column}>
      <div className={styles.wrap + " " + (className ? styles.first : "") || ""}>
        <div className={styles.list}>
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                key='content'
                initial='collapsed'
                animate='open'
                exit='collapsed'
                variants={{
                  open: { opacity: 1, height: 'auto' },
                  collapsed: { opacity: 0, height: 0 },
                }}
                className={styles.drop}
                style={{ overflow: 'hidden' }}
                transition={{ duration: 0.1 }}
              >
                {options && options.map((item: options) => {
                  if (item.value != selected) return (
                    <div className={styles.item} onClick={() => {
                      onChange(item.value);
                      setOpen(false);
                      setInner(item.label)
                    }
                    } key={item.label} >{item.label}</div>
                  )
                })}
                {sub && sub.map((item: string) => {
                  if (item != selected) return (
                    <div className={styles.item} onClick={() => {
                      onChange(item);
                      setOpen(false)
                    }
                    } key={item} >{item}</div>
                  )
                })}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
        <div className={styles.selected + (mixed ? " " + styles.mixed : "")} onClick={() => { setOpen(!open) }}>
          <span>{inner ? inner : selected}</span>
          <svg width="12" height="7" className={open ? styles.rotate : ""} viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.99994 6.37872C5.89227 6.37872 5.79294 6.36114 5.70194 6.32597C5.61094 6.29064 5.52177 6.22939 5.43444 6.14222L1.04619 1.75372C0.952524 1.66022 0.902524 1.54547 0.896191 1.40947C0.889691 1.27364 0.939691 1.15256 1.04619 1.04622C1.15252 0.939723 1.27044 0.886475 1.39994 0.886475C1.52944 0.886475 1.64736 0.939723 1.75369 1.04622L5.99994 5.29222L10.2462 1.04622C10.3397 0.952557 10.4544 0.902557 10.5904 0.896223C10.7263 0.889723 10.8474 0.939723 10.9537 1.04622C11.0602 1.15256 11.1134 1.27047 11.1134 1.39997C11.1134 1.52947 11.0602 1.64739 10.9537 1.75372L6.56544 6.14222C6.47811 6.22939 6.38894 6.29064 6.29794 6.32597C6.20694 6.36114 6.10761 6.37872 5.99994 6.37872Z" fill="#1C1B1F" />
          </svg>
        </div>

      </div >
    </div>

  )
}
