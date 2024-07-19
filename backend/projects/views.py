from rest_framework.response import Response
from rest_framework import status
from .serializers import ProjectSerializer
from utils.db_connector import create_connection, close_connection
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
import logging

# logging module configuration for logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

class ProjectListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        conn, cur = create_connection()
        cur.execute("SELECT id, name FROM projects")
        projects = cur.fetchall()
        
        # Convert list of tuples to list of dictionaries
        project_list = [{'id': p['id'], 'name': p['name']} for p in projects]
        close_connection(conn, cur)
        serializer = ProjectSerializer(project_list, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            name = serializer.validated_data['name']
            conn, cur = create_connection()
            cur.execute("INSERT INTO projects (name) VALUES (%s) RETURNING id", (name,))
            project_id = cur.fetchone()['id']
            conn.commit()
            close_connection(conn, cur)
            return Response({'id': project_id, 'name': name}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProjectDetailView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        conn, cur = create_connection()
        cur.execute("SELECT id, name FROM projects WHERE id=%s", (pk,))
        project = cur.fetchone()
        close_connection(conn, cur)
        if project is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ProjectSerializer({'id': project['id'], 'name': project['name']})
        return Response(serializer.data)

    def put(self, request, pk):
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            name = serializer.validated_data['name']
            conn, cur = create_connection()
            cur.execute("UPDATE projects SET name=%s WHERE id=%s", (name, pk))
            conn.commit()
            close_connection(conn, cur)
            return Response({'id': pk, 'name': name})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        conn, cur = create_connection()
        cur.execute("DELETE FROM projects WHERE id=%s", (pk,))
        conn.commit()
        close_connection(conn, cur)
        return Response(status=status.HTTP_204_NO_CONTENT)



