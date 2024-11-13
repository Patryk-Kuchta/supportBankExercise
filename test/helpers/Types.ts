type InputAndOptionallyOutput<T> = {input: T, output?: T}

export type DetailedInput = {
  date: {input: string, output: string},
  sender: InputAndOptionallyOutput<string>,
  receiver: InputAndOptionallyOutput<string>,
  narrative: InputAndOptionallyOutput<string>
  amount: InputAndOptionallyOutput<number>
}