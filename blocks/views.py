from django.views.generic import TemplateView
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
import os, json
import pdb

class BlockChainView(TemplateView):
    template_name = "index.html"

class SaveBlockInformationApiView(APIView):
	def post(self, request):
		try:
			content = request.data.get('content', dict())
			json_file = os.path.join(settings.BASE_DIR, "media/block-content.json")
			with open(json_file, 'w') as jsonf:
				jsonf.write(content)
			return Response({'message': 'Record set updated successfully !!', 'code': 200, 'errors': ""})
		except Exception as ex:
			return Response({'message': 'Record set updated failed !!', 'code': 500, 'errors': str(ex)})


class GetBlockInformationApiView(APIView):
	def get(self, request):
		try:
			json_file = os.path.join(settings.BASE_DIR, "media/block-content.json")
			jsonf = open(json_file, 'r')
			content = jsonf.read()
			return Response({'message': 'Record set loaded successfully !!', 'data': json.loads(content), 'code': 200, 'errors': ""})
		except Exception as ex:
			return Response({'message': 'Record set updated failed !!', 'data': [], 'code': 500, 'errors': str(ex)})
