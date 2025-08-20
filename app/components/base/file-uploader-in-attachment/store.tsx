import {
  createContext,
  useContext,
  useEffect,
  useRef,
} from 'react'
import {
  create,
  useStore as useZustandStore,
} from 'zustand'
import type {
  FileEntity,
} from './types'

type Shape = {
  files: FileEntity[]
  setFiles: (files: FileEntity[]) => void
  syncFilesFromProps: (files: FileEntity[]) => void
}

export const createFileStore = (
  value: FileEntity[] = [],
  onChange?: (files: FileEntity[]) => void,
) => {
  return create<Shape>(set => ({
    files: value ? [...value] : [],
    setFiles: (files) => {
      set({ files })
      onChange?.(files)
    },
    syncFilesFromProps: (files: FileEntity[]) => {
      set({ files })
    },
  }))
}

type FileStore = ReturnType<typeof createFileStore>
export const FileContext = createContext<FileStore | null>(null)

export function useStore<T>(selector: (state: Shape) => T): T {
  const store = useContext(FileContext)
  if (!store)
    throw new Error('Missing FileContext.Provider in the tree')

  return useZustandStore(store, selector)
}

export const useFileStore = () => {
  return useContext(FileContext)!
}

type FileProviderProps = {
  children: React.ReactNode
  value?: FileEntity[]
  onChange?: (files: FileEntity[]) => void
}
export const FileContextProvider = ({
  children,
  value,
  onChange,
}: FileProviderProps) => {
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const storeRef = useRef<FileStore | undefined>(undefined)

  if (!storeRef.current) {
    storeRef.current = createFileStore(value, (files) => {
      onChangeRef.current?.(files)
    })
  }

  useEffect(() => {
    storeRef.current?.getState().syncFilesFromProps(value || [])
  }, [value])

  return (
    <FileContext.Provider value={storeRef.current}>
      {children}
    </FileContext.Provider>
  )
}
