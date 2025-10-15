# Documentação da Solução de Alinhamento de IDs de Quartos

## Problema Identificado

Ao integrar os resultados de disponibilidade de quartos da API externa (`https://vhomeflathotel.facilityhotel.com.br/integracao/hotelDoForte/retornadisponibilidade`) com os dados locais dos quartos armazenados no Supabase (tabela `rooms`), observou-se que as imagens de capa e detalhes dos quartos estavam sendo carregados incorretamente. Especificamente, as imagens e informações de quartos com IDs mais altos na API externa estavam sendo associadas a quartos com IDs mais baixos no Supabase, resultando em uma exibição desalinhada (ex: a imagem do quarto 4 da API aparecia para o quarto 1 do Supabase).

## Causa Raiz

A análise revelou que havia um deslocamento nos IDs dos quartos entre a API externa e o banco de dados Supabase. Por exemplo, se o primeiro quarto no Supabase tinha `id: 1`, a API externa retornava o mesmo quarto com `idQuarto: 4`. Isso indicava uma diferença de `3` unidades nos IDs.

## Solução Implementada

Para corrigir esse desalinhamento, foi aplicada uma correção no arquivo `src/pages/BookingV2.tsx`, na função `handleSearch`. Antes de mesclar os dados da API externa com os dados locais do Supabase, o `idQuarto` retornado pela API externa é ajustado subtraindo o valor do deslocamento (`3`).

**Trecho de código relevante em `src/pages/BookingV2.tsx`:**

```typescript
      const mergedResults = data.map((apiRoom: any) => {
        const adjustedRoomId = apiRoom.idQuarto - 3; // CORREÇÃO: Subtraindo 3 para alinhar com IDs do Supabase
        const localRoom = localRoomsData.find(lr => lr.id === adjustedRoomId);
        return {
          ...apiRoom,
          idQuarto: adjustedRoomId, 
          imageUrl: localRoom?.imageUrl || null,
          details: localRoom?.details || null,
          details_order: localRoom?.details_order || null,
          special_name: localRoom?.special_name || null,
        };
      });
```

## Impacto da Solução

Com essa alteração, o `idQuarto` da API externa é corretamente mapeado para o `id` correspondente na tabela `rooms` do Supabase. Isso garante que:
*   As imagens de capa (`imageUrl`) corretas sejam carregadas para cada quarto.
*   Os detalhes (`details`), a ordem dos detalhes (`details_order`) e o nome especial (`special_name`) corretos do Supabase sejam associados aos resultados de disponibilidade.
*   A exibição dos quartos na página de consulta de disponibilidade seja precisa e consistente com os dados configurados no painel administrativo.

Esta solução garante a integridade da apresentação dos dados dos quartos, melhorando a experiência do usuário ao consultar a disponibilidade.