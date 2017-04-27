Dados da Lavajato
=================

Base de dados com informações da [Operação Lava Jato divulgados pelo Ministério Público Federal](http://lavajato.mpf.mp.br).

Objetivos
---------

As denúncias são estão expostas no site da operação como PDFs escaneados. Então um primeiro trabalho envolve [coletar esses PDFs](https://github.com/nighto/lavajato/tree/master/raw/1aInstancia/pdf), [convertê-los para texto (OCR)](https://github.com/nighto/lavajato/tree/master/raw/1aInstancia/txt) e finalmente [criar versões em Markdown, mantendo a formatação](https://github.com/nighto/lavajato/tree/master/raw/1aInstancia/markdown).

O passo seguinte é [georreferenciar estes dados](https://github.com/nighto/lavajato/blob/master/geojson/1aInstancia.geojson), com os endereços expostos nas denúncias, ou com o endereço residencial de um dos denunciados quando a denúncia não tiver um local específico.

Por fim, exibir esses dados em um [mapa](https://nighto.github.io/lavajato/), que permita realizar filtros por pessoas, valores etc.