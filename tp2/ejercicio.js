// Esta función construye una matriz de transfromación de 3x3 en coordenadas homogéneas 
// utilizando los parámetros de posición, rotación y escala. La estructura de datos a 
// devolver es un arreglo 1D con 9 valores en orden "column-major". Es decir, para un 
// arreglo A[] de 0 a 8, cada posición corresponderá a la siguiente matriz:
//
// | A[0] A[3] A[6] |
// | A[1] A[4] A[7] |
// | A[2] A[5] A[8] |
// 
// Se deberá aplicar primero la escala, luego la rotación y finalmente la traslación. 
// Las rotaciones vienen expresadas en grados. 
function BuildTransform( positionX, positionY, rotation, scale )
{
	const scaleMatrix = Array(
		scale,0,0,
		0,scale,0,
		0,0,1
	);

	const translationMatrix =  Array(
		1,0,0,
		0, 1, 0,
		positionX, positionY, 1);

	const rotationMatrix = Array(
		Math.cos(rotation), -Math.sin(rotation), 0,
		Math.sin(rotation), Math.cos(rotation),0,
		0,0,1
	)


	const a = ComposeTransforms(scaleMatrix, rotationMatrix);
	const b = ComposeTransforms(a, translationMatrix);
	return b;
}


// Esta función retorna una matriz que resula de la composición de trasn1 y trans2. Ambas 
// matrices vienen como un arreglo 1D expresado en orden "column-major", y se deberá 
// retornar también una matriz en orden "column-major". La composición debe aplicar 
// primero trans1 y luego trans2. 
function ComposeTransforms( trans2, trans1 )
{
	const res = [];
	for(let i = 0; i < 3; i += 1) {
		let offset2 = i*3;
		
		for (let j = 0; j < 3 ; j+=1) {
			let offset1 = j;

			let val =
				trans1[0 + offset1] * trans2[0 + offset2] +
				trans1[3 + offset1] * trans2[1 + offset2] +
				trans1[6 + offset1] * trans2[2 + offset2];
			res.push(val);
		}
	}
	return res;
}


