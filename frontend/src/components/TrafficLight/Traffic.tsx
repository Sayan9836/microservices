import { useEffect, useRef, useState } from "react"

const initialState = [
  { id: 0, color: 'red'},
  { id: 1, color: '' },
  { id: 2, color: '' },
]


const Traffic = () => {

  const [data, setData] = useState<Array<{id:number, color: string}>>(initialState)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    const cycleLights = () => {
      setData((prevData) => {
        let waitTime: number;
        let newData;

        if (prevData[0].color === 'red') {
          newData = [
            {id: 0, color: ''},
            {id: 1, color: 'yellow'},
            {id: 2, color: ''},
          ];
          waitTime = 2000;
        } else if (prevData[1].color === 'yellow') {
          newData = [
            {id: 0, color: ''},
            {id: 1, color: ''},
            {id: 2, color: 'green'},
          ];
          waitTime = 10000;
        } else {
          newData = [
            {id: 0, color: 'red'},
            {id: 1, color: ''},
            {id: 2, color: ''},
          ];
          waitTime = 5000;
        }

        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(cycleLights, waitTime);
        return newData;
      })
    }

    timerRef.current = setTimeout(cycleLights, 5000)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  return (
    <div className="flex justify-center items-center mt-[30vh]">
      <div className="border-2 border-black-200 flex items-center gap-4 w-fit p-4 rounded-full rotate-90">
        {
          data.map((ele) => {
            return <IndivitualLight currLight={ele.color} key={ele.id}/>
          })
        }
      </div>
    </div>
  )
}


const IndivitualLight = ({ currLight }: {currLight: string}) => {

  return (
    <div className={`w-10 h-10 rounded-full`} style={{ backgroundColor: currLight, border: `1px solid black`}}></div>
  )
}

export default Traffic
