import React, { memo, useEffect, useLayoutEffect } from 'react'
import styles from '../styles.module.scss'

/**
 * useEffect
 * 接收两个参数，第一个参数是一个函数，第二个参数是一个数组或空，
 * 第一个代表要执行的副作用，第二个为依赖项
 * 副作用函数可以返回一个函数在下一次执行useEfect时执行，用来清除监听等
 * 当依赖项为空时，每次渲染都会执行副作用函数
 * 当依赖项为空数组时，只有第一次渲染时才会执行副作用函数
 * 
 * 可以用来模拟Class组件的生命周期钩子，componentDidMount compontentDidUpdate componentWillUnmount
 * 
 * 
 * useLayoutEffect 的区别
 * useEffect是异步执行的，也就是说在执行useEffect的副作用函数时，页面上已经渲染了DOM，如果副作用函数修改了dom，那么页面会重新渲染
 * useLayoutEffect是同步执行的，也就是说在执行useLayoutEffect的副作用函数时，页面上还没有渲染DOM，如果副作用函数修改了dom，会在页面更新时渲染到页面上
 * 但是如果useLayoutEffect的副作用函数中有异步操作，那么渲染的流程就和useEffect一样了
 * 
 * 
 * useLayoutEffect的执行时机与Class组件的componentDimount相同
 */


const fetchList = () => new Promise(resolve => {
  setTimeout(() => {
    resolve([1, 2, 3])
  }, 2000)
})


function EffectView() {
  const [count, setCount] = React.useState(0)
  const [dataList, setDataList] = React.useState([])
  const [renderStr, setRenderStr] = React.useState('render')

  useEffect(() => {
    console.log('effect') // 每次渲染都会执行

    return () => console.log('unmount')
  })

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchList()
      setDataList(res)
    }
    fetchData()
    console.log('null effect') // 只会在第一次render时执行
  }, [])

  useEffect(() => {
    console.log('count effect') // 只会在count变化时执行
  }, [count])

  useEffect(() => {
    // let i = 0
    // while(i < 99999999) {
    //   i++
    // }
    setRenderStr('layout')
    console.log('layout effect') 
  }, [])

  const addHandler = () => {
    setCount(count + 1)
  }

  console.log('render')
  return (
    <div className={styles.border}>
      <div>EffectView</div>
      {
        dataList.length ? dataList.map(item => <div key={item}>{item}</div>) : 'loading'
      }
      <button onClick={addHandler}>{count}</button>
      <div>{renderStr}</div>
    </div>
  )
}

export default memo(EffectView)
