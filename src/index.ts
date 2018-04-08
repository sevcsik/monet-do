import { IMonad, IMonadStatic, Maybe } from "monet"

export function genericDo<M extends IMonad<any>>(monad: IMonadStatic, co: () => IterableIterator<M>): M {
	function isNotDone(el: IteratorResult<M> | IteratorResult<any>): el is IteratorResult<M> { return !el.done }

	const it: IterableIterator<M> = co()
	const iterate: (el: IteratorResult<M> | IteratorResult<any>) => M = el =>
		(isNotDone(el) ? el.value.bind((val: any) => iterate(it.next(val))) : monad.unit(el.value)) as M

	return iterate(it.next())
}

export function maybeDo(co: () => IterableIterator<Maybe<any>>): Maybe<any> { return genericDo(Maybe, co) }

