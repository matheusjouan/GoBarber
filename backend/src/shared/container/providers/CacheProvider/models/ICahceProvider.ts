export default interface ICacheProvider {
  save(key: string, value: any): Promise<void>;
  // Invalida o cache tendo todos os dados
  invalidate(key: string): Promise<void>;
  // Invalida todos os caches que começa com algum tipo de texto
  invalidatePrefix(prefix: string): Promise<void>;
  // T => argumento de tipo
  recover<T>(key: string): Promise<T | null>;
}
