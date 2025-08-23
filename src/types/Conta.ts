export type Conta = {
    id: number;
    descricao: string;
    valor: number;
    dataVencimento: string; 
    dataPagamento: string;  
    situacao: number;
    pessoaId: string;
};