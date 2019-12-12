export const TipoMascara = {
    cnpj: { regex: /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/g, replace: '$1.$2.$3/$4-$5' },
    cpf: { regex: /^(\d{3})(\d{3})(\d{3})(\d{2})$/g, replace: '$1.$2.$3-$4' },
    data: { regex: /^(\d{4})-(\d{2})-(\d{2})$/g, replace: '$3/$2/$1' },
    datahora: { regex: /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/g, replace: '$3/$2/$1 às $4:$5:$6' },
    mesAno: { regex: /^(\d{4})-(\d{2})-(\d{2})$/g, replace: '$2/$1'},
    money: { regex: /(\d)(?=(\d{3})+(?!\d))/g, replace: '$1.' }
}