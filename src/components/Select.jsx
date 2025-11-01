import React, {useId} from 'react'

function Select({
    options,
    label,
    className,
    ...props
}, ref) {
    const id = useId()
  return (
    <div className='w-full'>
        {label && <label htmlFor={id} className='inline-block mb-2 pr-1 text-gray-700 font-medium'>{label}</label>}
        <select
        {...props}
        id={id}
        ref={ref}
        className={`px-4 py-3 rounded-xl bg-gray-50 text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-purple-500 duration-200 border border-gray-300 w-full transition-all ${className}`}
        >
            {options?.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    </div>
  )
}

export default React.forwardRef(Select)