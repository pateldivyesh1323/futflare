package s3lib

import (
	"context"
	"io"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/pateldivyesh1323/futflare/server/internal/config"
)

type Client struct {
	s3Client *s3.Client
}

func New(s3Client *s3.Client) *Client {
	return &Client{
		s3Client: s3Client,
	}
}

func (c *Client) UploadFile(ctx context.Context, key string, body io.Reader) error {
	_, err := c.s3Client.PutObject(ctx, &s3.PutObjectInput{
		Bucket: aws.String(config.AWSS3Bucket),
		Key:    aws.String(key),
		Body:   body,
	})

	return err
}

func (c *Client) GetFileURL(ctx context.Context, key string, expiry int) (string, error) {
	return "", nil
}

func (c *Client) DeleteFile(ctx context.Context, key string) error {
	_, err := c.s3Client.DeleteObject(ctx, &s3.DeleteObjectInput{
		Bucket: aws.String(config.AWSS3Bucket),
		Key:    aws.String(key),
	})

	return err
}
